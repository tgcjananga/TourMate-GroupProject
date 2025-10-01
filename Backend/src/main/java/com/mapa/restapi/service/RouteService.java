package com.mapa.restapi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mapa.restapi.exception.RouteServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Service
public class RouteService {

    @Value("${openrouteservice.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public RouteService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getRouteDetails(String startLocation, String endLocation) {
        // Geocode start location
        String startLatLon = geocodeLocation(startLocation);
        if (startLatLon == null) {
            return "{\"error\": \"Unable to geocode start location\"}";
        }

        // Geocode end location
        String endLatLon = geocodeLocation(endLocation);
        if (endLatLon == null) {
            return "{\"error\": \"Unable to geocode end location\"}";
        }

        // Get route details using geocoded coordinates
        String url = String.format("https://api.openrouteservice.org/v2/directions/driving-car?api_key=%s&start=%s&end=%s",
                apiKey, startLatLon, endLatLon);

        try {
            String response = this.restTemplate.getForObject(url, String.class);
            return response;
        } catch (Exception e) {
            return "{\"error\": \"An error occurred while fetching route details\"}";
        }
    }

    public Map<String, Double> extractDistanceAndDuration(String startLocation, String endLocation) {

        String jsonResponse = getRouteDetails(startLocation, endLocation);

        Map<String, Double> result = new HashMap<>();
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(jsonResponse);

            // Extract distance and travel time from the summary field
            JsonNode summaryNode = jsonNode.path("features").get(0).path("properties").path("summary");

            if (summaryNode.isMissingNode() || summaryNode.isNull()) {
                throw new RouteServiceException("Unable to extract distance and duration");
            }

            double distance = summaryNode.path("distance").asDouble();
            double duration = summaryNode.path("duration").asDouble();

            // Add distance and duration to the result map
            result.put("Distance", distance/1000);  //Km
            result.put("Duration", duration/60);    //Minutes
        } catch (Exception e) {
            result.put("error", -1.0);  // Using -1 to indicate an error
        }
        return result;
    }

    private String geocodeLocation(String location) {
        String url = String.format("https://api.openrouteservice.org/geocode/search?api_key=%s&text=%s",
                apiKey, location);

        String response = this.restTemplate.getForObject(url, String.class);
        // Parse the response to extract the coordinates (latitude and longitude)
        // You can use a library like Jackson to parse the JSON response

        // Assuming the response contains a 'features' array with 'geometry' containing 'coordinates'
        // Example parsing logic (this is just a placeholder, you need to adjust it based on the actual response structure):
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode features = root.path("features");
            if (features.isArray() && !features.isEmpty()) {
                JsonNode coordinates = features.get(0).path("geometry").path("coordinates");
                if (coordinates.isArray() && coordinates.size() == 2) {
                    double lon = coordinates.get(0).asDouble();
                    double lat = coordinates.get(1).asDouble();
                    return lon + "," + lat;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    public List<double[]> extractWaypoints(String jsonResponse) throws Exception {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(jsonResponse);

        List<double[]> waypoints = new ArrayList<>();
        JsonNode coordinates = rootNode.path("features").get(0).path("geometry").path("coordinates");

        for (JsonNode coordinate : coordinates) {
            double lon = coordinate.get(0).asDouble();
            double lat = coordinate.get(1).asDouble();
            waypoints.add(new double[]{lat, lon});
        }

        return waypoints;
    }

    public Set<String> getCitiesFromCoordinates(List<double[]> coordinatesList) {
        Set<String> cities = new HashSet<>();
        ObjectMapper objectMapper = new ObjectMapper();
        HttpURLConnection connection = null;
        BufferedReader in = null;

        for (double[] coordinates : coordinatesList) {
            String urlString = String.format(
                    "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=%f&lon=%f",
                    coordinates[0], coordinates[1]);

            try {
                URL url = new URL(urlString);
                connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");

                in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String inputLine;
                StringBuilder content = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }

                // Parse the JSON response to extract the city/town/village
                String jsonResponse = content.toString();
                //System.out.println(jsonResponse);
                JsonNode jsonNode = objectMapper.readTree(jsonResponse);
                String city = jsonNode.path("address").path("city").asText();
                if (city.isEmpty()) {
                    city = jsonNode.path("address").path("town").asText();
                }
//                if (city.isEmpty()) {
//                    city = jsonNode.path("address").path("village").asText();
//                }

                cities.add(city);

            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                // Ensure resources are closed
                if (in != null) {
                    try {
                        in.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                if (connection != null) {
                    connection.disconnect();
                }
            }
        }

        return cities;
    }

    public Set<String> getCitiesAlongRoute(String startLocation, String endLocation) throws Exception {
        String jsonResponse = getRouteDetails(startLocation, endLocation);
        //System.out.println(jsonResponse);
        List<double[]> waypoints = extractWaypoints(jsonResponse);
        System.out.println("Num of Waypoints :"+waypoints.size());

        List<double[]> desireWaypoints = new ArrayList<>();

        for (int i=0;i<=waypoints.size();i=i+30) {
            desireWaypoints.add(waypoints.get(i));
        }
        System.out.println("Num of Selected waypoints:"+desireWaypoints.size());
        Set<String> cities = getCitiesFromCoordinates(desireWaypoints);
        return cities;
    }



}


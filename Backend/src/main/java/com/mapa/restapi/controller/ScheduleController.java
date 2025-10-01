package com.mapa.restapi.controller;

import com.itextpdf.text.DocumentException;
import com.mapa.restapi.dto.ScheduleEventDto;
import com.mapa.restapi.model.ScheduleEvent;
import com.mapa.restapi.service.PDFGenerationService;
import com.mapa.restapi.service.ScheduleEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@CrossOrigin(origins="*",allowedHeaders = "*")
@RequestMapping("/api")
public class ScheduleController {

    @Autowired
    private  PDFGenerationService pdfGenerationService;
    @Autowired
    private  ScheduleEventService scheduleEventService;


    @GetMapping("/schedule/{scheduleId}/pdf")
    public ResponseEntity<InputStreamResource> downloadSchedulePdf(@PathVariable Long scheduleId) throws DocumentException {
        ScheduleEvent scheduleEvent = scheduleEventService.getScheduleById(scheduleId);
        ByteArrayInputStream bis = pdfGenerationService.generateSchedulePdf(scheduleEvent);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=schedule.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @PostMapping("/schedule/download")
    public ResponseEntity<InputStreamResource> downloadTravelDetailsPdf(
            @RequestBody ScheduleEvent scheduleEvent) throws DocumentException {

        ByteArrayInputStream bis = pdfGenerationService.generateSchedulePdf(scheduleEvent);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=schedule.pdf"); //PDF can view in browser

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping("/schedule/getschedules")
    public ResponseEntity<List<ScheduleEventDto>> getSchedule(@AuthenticationPrincipal UserDetails userDetails){
        String username = userDetails.getUsername();
        return ResponseEntity.ok( scheduleEventService.getAllSchedules(username));
    }

    @PostMapping("/schedule/addschedule")
    public ResponseEntity<String> addSchedule(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ScheduleEvent schedule){
        String username = userDetails.getUsername();
        int response=scheduleEventService.addScheduleEvent(username,schedule);
        if (response!=0){
            return ResponseEntity.badRequest().body("Error in saving Schedule");
        }
        return ResponseEntity.ok("Successfully added schedule");

    }

    @DeleteMapping("/schedule/deleteSchedule/{scheduleId}")
    public ResponseEntity<String> deleteSchedule(@PathVariable Long scheduleId , @AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        int code = scheduleEventService.deleteScheduleById(email,scheduleId);
        if (code==0){
            return ResponseEntity.ok("Successfully deleted Schedule");
        }
        return ResponseEntity.badRequest().body("Error in deleting Schedule");
        
    }

}

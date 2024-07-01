package com.mapa.restapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mapa.restapi.dto.MailBody;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSimpleMessage(MailBody mailBody) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("tgcjananga@gmail.com");
        message.setTo(mailBody.to());
        message.setText(mailBody.text());
        message.setSubject(mailBody.subject());

        mailSender.send(message);
        System.out.println("Mail send successfully...");



    
}
}
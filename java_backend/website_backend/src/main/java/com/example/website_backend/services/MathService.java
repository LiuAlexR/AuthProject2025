package com.example.website_backend.services;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Service;
@Service
public class MathService {
    public MathService(){
        
    }
    public boolean verifyJWTSignature(String token) {
        String secret = "a-string-secret-at-least-256-bits-long";
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            return false;
        }

        String headerAndPayload = parts[0] + "." + parts[1];
        String providedSignature = parts[2];
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            Mac hmacSha256 = Mac.getInstance("HmacSHA256");

            hmacSha256.init(secretKeySpec);

            // Compute the HMAC signature of the header and payload
            byte[] computedSignatureBytes = hmacSha256.doFinal(headerAndPayload.getBytes(StandardCharsets.UTF_8));

            // Encode the computed signature to Base64Url
            String computedSignature = Base64.getUrlEncoder().encodeToString(computedSignatureBytes);

            // Compare the computed signature with the provided signature from the token
            return computedSignature.equals(providedSignature);

        } catch (NoSuchAlgorithmException e) {
            System.err.println("HmacSHA256 algorithm not found: " + e.getMessage());
            return false;
        } catch (Exception e) {
            System.err.println("An unexpected error occurred during JWT signature verification: " + e.getMessage());
            return false;
        }
    }

}

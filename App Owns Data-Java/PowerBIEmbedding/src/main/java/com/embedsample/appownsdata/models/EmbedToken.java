package com.embedsample.appownsdata.models;

/**
 * EmbedToken holds fields related to the embed token response
 */
public class EmbedToken {
	
	// token 
    public String token;
    
    // token id
    public String tokenId;

    // token expiration time
    public String expiration;
	
	// Parameterized constructor
    public EmbedToken(String token, String tokenId, String expiration) {
    	this.token = token;
    	this.tokenId = tokenId;
    	this.expiration = expiration;
    }
}

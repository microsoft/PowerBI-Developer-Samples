package com.embedsample.appownsdata.models;

/**
 * Properties for embedding the report 
 */
public class EmbedConfig {
	public String reportId = "";

    public String embedUrl = "";

    public EmbedToken embedToken;

    public Boolean isEffectiveIdentityRolesRequired = false;

    public Boolean isEffectiveIdentityRequired = false;
    
    public String datasetId = "";

    public Boolean enableRLS = false;

    public String username;

    public String roles;

    public String errorMessage;
}

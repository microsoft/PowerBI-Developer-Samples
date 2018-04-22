package com.pliu.powerbiembed;

/**
 * Created by pliu on 11/14/2016.
 */
public class Report {
    public String id;
    public String name;
    public String webUrl;
    public String embedUrl;

    public void setId (String id) {this.id = id;}
    public void setName (String name) {this.name = name;}
    public void setWebUrl (String webUrl) {this.webUrl = webUrl;}
    public void setEmbedUrl (String embedUrl) {this.embedUrl = embedUrl;}

    public String getName () {return this.name;}
    public String getId() {return this.id;}
    public String getWebUrl() {return this.webUrl;}
    public String getEmbedUrl() {return this.embedUrl;}
}

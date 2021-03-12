// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.models;

public class AddDatasourceRequest {
	
	public String gatewayId;
	
	public String dataSourceType;
	
	public String connectionDetails;

	public String dataSourceName;

	public String credType;
	
	public String privacyLevel;

	public String[] credentialsArray;
}

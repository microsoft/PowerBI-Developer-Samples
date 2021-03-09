// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.updatecredentialsample.encryptcredential.models;

public class UpdateDatasourceCredentialsRequest {

	public String datasourceId;

	public String credType;
	
	public String privacyLevel;

	public String[] credentialsArray;

	public String gatewayId;
}

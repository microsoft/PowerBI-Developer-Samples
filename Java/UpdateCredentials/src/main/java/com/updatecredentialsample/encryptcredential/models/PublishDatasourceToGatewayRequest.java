// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.updatecredentialsample.encryptcredential.models;

public class PublishDatasourceToGatewayRequest {

	public String dataSourceType;
	public String connectionDetails;
	public CredentialDetails credentialDetails;
	public String dataSourceName;

	public PublishDatasourceToGatewayRequest(
			String dataSourceType,
			String connectionDetails,
			CredentialDetails credentialDetails,
			String dataSourceName) {
		this.dataSourceType = dataSourceType;
		this.connectionDetails = connectionDetails;
		this.credentialDetails = credentialDetails;
		this.dataSourceName = dataSourceName;
	}
}

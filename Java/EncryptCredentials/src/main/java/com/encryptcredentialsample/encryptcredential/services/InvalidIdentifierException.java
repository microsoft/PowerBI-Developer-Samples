// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

package com.encryptcredentialsample.encryptcredential.services;

public class InvalidIdentifierException extends IllegalArgumentException {
	private static final long serialVersionUID = 1L;

	public InvalidIdentifierException(String message) {
		super(message);
	}
}

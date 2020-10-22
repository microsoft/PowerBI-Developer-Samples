// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// Configurations of the embedded reports
class PowerBiReportDetails {
    constructor(reportId, reportName, embedUrl) {
        this.reportId = reportId;
        this.reportName = reportName;
        this.embedUrl = embedUrl;
    }
}

module.exports = PowerBiReportDetails;
---
topic: sample
languages:
  - csharp
  - js
products:
  - dotnet-core
  - power-bi
---

[![Build Status](https://powerbi.visualstudio.com/Embedded/_apis/build/status/Devolper-Samples-Azure%20Web%20App%20for%20ASP.NET-CI?branchName=master)](https://powerbi.visualstudio.com/Embedded/_build/latest?definitionId=2824&branchName=master)

## Power BI API Code Samples

In this repository you can find sample apps expaining how to use Power BI API for developers.

Read this documentation to prepare your environment
https://docs.microsoft.com/en-us/power-bi/developer/embedding-content

Use one of the following samples to expirience the API.

You can use the instructions in each sample's directory to learn how to register an app, configure and run the sample.


## Troubleshooting

### Visual Studio 2013
To resolve a 'CS0012:Predefined type 'System.Object' is not defined or imported' error, please update web.config.

Find line:
 ```xml
 <compilation debug="true" targetFramework="4.5"/>
 ```
 
 And modify it to:
 
 ```xml
 <compilation debug="true" targetFramework="4.5">
  <assemblies>     
    <add assembly="System.Runtime, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b03f5f7f11d50a3a" />   
  </assemblies>
</compilation>
```

## Issues
[Power BI Support Page](https://powerbi.microsoft.com/en-us/support/)

[Power BI Ideas](https://ideas.powerbi.com)

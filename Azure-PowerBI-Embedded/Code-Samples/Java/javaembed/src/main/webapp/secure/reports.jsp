<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Reports Secure Page</title>
</head>
<body>

	<form action="report">
        <select name="reporturl">
            <option value="${reports[0].embedUrl}">${reports[0].name}</option>
            <option value="${reports[1].embedUrl}">${reports[1].name}</option>
            <option value="${reports[2].embedUrl}">${reports[2].name}</option>
            <option value="${reports[3].embedUrl}">${reports[3].name}</option>
            <option value="${reports[4].embedUrl}">${reports[4].name}</option>
            <option value="${reports[5].embedUrl}">${reports[5].name}</option>
            <option value="${reports[6].embedUrl}">${reports[6].name}</option>
        </select>
	    <input type="submit" value="Submit">
    </form>

    <br>

	<form action="<%=request.getContextPath()%>/logout" method = "post">
		<input type="submit" value="Logout">
	</form>

</body>
</html>
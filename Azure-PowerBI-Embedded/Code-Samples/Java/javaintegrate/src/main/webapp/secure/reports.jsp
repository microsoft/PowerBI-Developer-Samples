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
        </select>
	    <input type="submit" value="Submit">
    </form>

    <br>

	<form action="/">
		<input type="submit" value="Home Page">
	</form>

</body>
</html>
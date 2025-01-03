<%@ Page Language="C#" %>

<%

    String strExc = "";
    try
    {
        //Get the image data from the database
        HttpRequest request = HttpContext.Current.Request;

        String strImageName;
        String strImageExtName;

        strImageName = request["ImageName"];
        strImageExtName = request["ImageExtName"];

        String filePath = Server.MapPath(".") + "\\UploadedImages\\" + strImageName;

        System.IO.FileInfo fileInfo = new System.IO.FileInfo(filePath);
        Response.ClearContent();
        Response.ClearHeaders();
        Response.Clear();
        Response.Buffer = true;

        if (strImageExtName == "bmp")
        {
            Response.ContentType = "image/bmp";
        }
        else if (strImageExtName == "jpg")
        {
            Response.ContentType = "image/jpg";
        }
        else if (strImageExtName == "tif")
        {
            Response.ContentType = "image/tiff";
        }
        else if (strImageExtName == "png")
        {
            Response.ContentType = "image/png";
        }
        else if (strImageExtName == "pdf")
        {
            Response.ContentType = "application/pdf";
        }

        try
        {
            String strRealFileName = strImageName;
            int index = strImageName.IndexOf("\\");
            if (index >= 0) {
                strRealFileName = strImageName.Substring(index + 1, strImageName.Length - index -1);
            }

            String fileNameEncode;
            fileNameEncode = HttpUtility.UrlEncode(strRealFileName, System.Text.Encoding.UTF8);
            fileNameEncode = fileNameEncode.Replace("+", "%20");
            String appendedheader = "attachment;filename=" + fileNameEncode;
            Response.AppendHeader("Content-Disposition", appendedheader);
            Response.WriteFile(fileInfo.FullName);

        }
        catch (Exception exc)
        {
            strExc = exc.ToString();
            DateTime d1 = DateTime.Now;
            string logfilename = d1.Year.ToString() + d1.Month.ToString() + d1.Day.ToString() + d1.Hour.ToString() + d1.Minute.ToString() + d1.Second.ToString() + "log.txt";
            String strField1Path = HttpContext.Current.Request.MapPath(".") + "/" + logfilename;
            if (strField1Path != null)
            {
                System.IO.StreamWriter sw1 = System.IO.File.CreateText(strField1Path);
                sw1.Write(strExc);
                sw1.Close();
            }
            Response.Flush();
            Response.Close();
        }
    }
    catch (Exception ex)
    {
        strExc = ex.ToString();
        DateTime d1 = DateTime.Now;
        string logfilename = d1.Year.ToString() + d1.Month.ToString() + d1.Day.ToString() + d1.Hour.ToString() + d1.Minute.ToString() + d1.Second.ToString() + "log.txt";
        String strField1Path = HttpContext.Current.Request.MapPath(".") + "/" + logfilename;
        if (strField1Path != null)
        {
            System.IO.StreamWriter sw1 = System.IO.File.CreateText(strField1Path);
            sw1.Write(strExc);
            sw1.Close();
        }
        Response.Write(strExc);
    }
%>
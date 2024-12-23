<%@ Page Language="C#" %>
<%
    try
    {
        string strImageName, strImageSize;
        HttpFileCollection files = HttpContext.Current.Request.Files;
        HttpPostedFile uploadfile = files["RemoteFile"];
        strImageName = uploadfile.FileName;
        strImageSize = Convert.ToString(Convert.ToInt32(uploadfile.ContentLength / 1024)) + "KB";
        string strImageSavePath = Server.MapPath(".") + "\\Upload\\";
        if (!System.IO.Directory.Exists(strImageSavePath))
        {
            System.IO.Directory.CreateDirectory(strImageSavePath);
        }
        String strInputFile = strImageSavePath + strImageName;

        uploadfile.SaveAs(strInputFile);
       
		Response.Write("DWTUploadFileName:" + strImageName + "UploadedFileSize:" + strImageSize);
    }
    catch
    {
    }
%>
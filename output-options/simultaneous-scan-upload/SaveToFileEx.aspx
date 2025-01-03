<%@ Page Language="C#" %>
<%
    try
    {
        string strImageName, strImageSize;
        strImageName = Request["filename"];

        HttpFileCollection files = HttpContext.Current.Request.Files;
        HttpPostedFile uploadfile = files["RemoteFile"];
        if (strImageName == null || strImageName == "")
        {
            strImageName = uploadfile.FileName;
        }
        DateTime dt = DateTime.Now;

        strImageSize = Convert.ToString(Convert.ToInt32(uploadfile.ContentLength / 1024)) + "KB";

        string strImageSavePath = Server.MapPath(".") + "\\UploadedImages\\" + dt.Ticks + "\\";
        if (!System.IO.Directory.Exists(strImageSavePath))
        {
            System.IO.Directory.CreateDirectory(strImageSavePath);
        }
        String strInputFile = strImageSavePath + strImageName;

        uploadfile.SaveAs(strInputFile);
        int fieldsCount = HttpContext.Current.Request.Form.Count;
        string _fields = "";
        if (fieldsCount >= 1) {
            _fields = "FieldsTrue:" + HttpContext.Current.Request.Form["CustomInfo"];
        }
        Response.Write(_fields + "DWTUploadFileName:" + strImageName + "UploadedRealFileName:" + dt.Ticks + "\\" + strImageName);
        Response.End();
    }
    catch
    {
    }
%>
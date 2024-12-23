<%@ Page Language="C#" %>
<%
    try
    {
        HttpRequest request = HttpContext.Current.Request;
        String strImageName;
        strImageName = request["ImageName"];
        if (strImageName != "")
        {
            String filePath = Server.MapPath(".") + "\\UploadedImages\\" + strImageName;

            if (System.IO.File.Exists(filePath))
            {
                System.IO.FileInfo fi = new System.IO.FileInfo(filePath);
                if (fi.Attributes.ToString().IndexOf("ReadyOnly") >= 0)
                {
                    fi.Attributes = System.IO.FileAttributes.Normal;
                }
                System.IO.File.Delete(filePath);

                int index = filePath.LastIndexOf("\\");
                if (index > 0) {
                    String path = filePath.Substring(0, index);
                    System.IO.Directory.Delete(path);
                }
            }
        }

    }
    catch
    {
    }
%>
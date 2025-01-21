
function init(Containers, bAutoLoad){
	if(Containers)
		Dynamsoft.DWT.Containers = Containers;
	else
		Dynamsoft.DWT.Containers = [];
	Dynamsoft.DWT.ProductKey = "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9";
	Dynamsoft.DWT.ResourcesPath = 'https://cdn.jsdelivr.net/npm/dwt@latest/dist';
	Dynamsoft.DWT.AutoLoad = bAutoLoad?true:false;
}

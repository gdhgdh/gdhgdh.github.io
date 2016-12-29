BranchSelWindow = function () {
    BranchSelWindow.superclass.constructor.apply(this, arguments);
}
mini.extend(BranchSelWindow, mini.BaseSelectWindow, {
    keyLable: "部门编号/分部名称：",
    gridcolumns: [
    	{ type: "checkcolumn", width:'50', headerAlign: "center" }, 
		{ header: "分部编号", field: "BranchCode", headerAlign: "center" , align: "center" },
		{ header: "分部名称", field: "BranchName", headerAlign: "center" , align: "center" },
		{ header: "审核", field: "RecordStatus", headerAlign: "center" , align: "center" },
		{ header: "分部类型", field: "BranchType", displayField: "BranchTypeName", headerAlign: "center" , align: "center" },
		{ header: "上级部门", field: "ParentId", displayField:"ParentName", headerAlign: "center" , align: "center" },
    ]
});
mini.regClass(BranchSelWindow, "branchselwindow");
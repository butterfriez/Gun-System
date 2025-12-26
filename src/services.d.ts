interface ReplicatedStorage extends Instance {
	Assets: Folder & { [k in string]: Tool };
}

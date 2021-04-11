export function differenceOfSets(a: Set<any>, b: Set<any>): Set<any> {
	return new Set([...a].filter((x) => !b.has(x)));
}

export type Indexable = string | number | symbol

export interface MineralsData {
	name: string
	value: string
}

export type MineralsOutput = {
	minerals: MineralsData[]
}

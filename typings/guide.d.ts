type GuideArea = { objectId : string, name : string, lnglat : GuidePointer, coverImageList : string[], introduce : string }
type GuideToilet = GuideArea
type GuideItem = GuideArea & { type : 'area' | 'toilet' }
type GuidePointer = { longitude : number, latitude : number }
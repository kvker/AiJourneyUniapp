type GuideArea = { _id : string, name : string, lnglat : GuidePointer, coverImageList : string[], introduce : string }
type GuideToilet = GuideArea
type GuideAttention = GuideArea
type GuideItem = GuideArea & { type : 'area' | 'toilet' | 'attention' }
type GuidePointer = { longitude : number, latitude : number }
type GuideAttraction = { _id : string, name : string, introduceImageList : string[], introduceVideo : string, }
type GuideStyleIntroduce = { introduce : string, voice : string }
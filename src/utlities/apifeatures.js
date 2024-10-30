export class apiFeatures {
  constructor(mongooseQuery, searchQuery) {
    this.mongooseQuery = mongooseQuery
    this.searchQuery = searchQuery
  }

  async pagination() {
    if (this.searchQuery.page < 1 || this.searchQuery.limit < 1) {
      this.searchQuery.page = this.searchQuery.limit = 1
    }
    let pageNumber = parseInt(this.searchQuery.page) || 1
    let limit = parseInt(this.searchQuery.limit) || 3
    if (limit > 10) limit = 10
    let skip = (pageNumber - 1) * limit
    this.pageNumber = pageNumber
    this.limit = limit

    // هذا السطر مهم لضمان أن لديك العدد الصحيح من الوثائق
    this.results = await this.mongooseQuery.model.countDocuments(this.mongooseQuery.getFilter())

    // تأكد من أن هذه السطور تعمل بشكل صحيح
    this.mongooseQuery.skip(skip).limit(limit)
    return this.mongooseQuery // يجب أن يتم إرجاع هذا هنا
  }

  filter() {
    let filterObj = structuredClone(this.searchQuery)
    filterObj = JSON.stringify(filterObj)
    filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, (value) => `$${value}`)
    filterObj = JSON.parse(filterObj)
    let excludedFields = ["page", "sort", "limit", "fields", "search"]
    excludedFields.forEach((val) => {
      delete filterObj[val]
    })

    this.mongooseQuery.find(filterObj)
    return this
  }

  sort() {
    if (this.searchQuery.sort) {
      let sortedBy = this.searchQuery.sort.split(",").join(" ")
      this.mongooseQuery.sort(sortedBy)
    }
    return this
  }

  fields() {
    if (this.searchQuery.fields) {
      let selectedFields = this.searchQuery.fields.split(",").join(" ")
      //console.log(selectedFields)
      this.mongooseQuery.select(selectedFields)
    }
    return this
  }

  search() {
    if (this.searchQuery.search) {
      const searchRegex = new RegExp(this.searchQuery.search, "i") // Regular expression for case-insensitive search
      this.mongooseQuery.find({
        $or: [{ name: { $regex: searchRegex } }, { Desc: { $regex: searchRegex } }],
      })
    }
    return this
  }
}

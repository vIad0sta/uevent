class EventDTO {
    constructor(data) {
        this.id = data.id
        this.title = data.title
        this.description = data.description
        this.ticket = data.ticket;
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.CompanyId = data.CompanyId;
        this.format = data.format;
        this.location = data.location;
        this.poster = data.poster;
        this.attendeesVisibility = data.attendeesVisibility;
        this.EventFormatId = data.EventFormatId
        this.EventThemeId = data.EventThemeId
    }
}
module.exports = EventDTO
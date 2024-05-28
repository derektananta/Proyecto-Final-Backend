
export default class UserProfileDTO {
    constructor(userData) {
        this.name = userData.first_name + " " + userData.last_name;
        this.email = userData.email;
        this.role = userData.role;
    }
}
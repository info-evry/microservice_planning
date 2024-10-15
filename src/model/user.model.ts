// Prevent projects from being in the token
export class JWTUser {
    id?: number;
    name?: string;
    surname?: string;
    email?: string;

    hydrate(user: any) {
        this.id = user.id;
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;

        return this;
    }
}

class StudentManager {
    private static instance: StudentManager;
    private firstName: string | null = null;
    private lastName: string | null = null;
    private program: string | null = null;
    private number: number | null = null;
    private year: number | null = null;
    private classRoom: string | null = null;
    private studentId: string | null = null;

    private constructor() { }

    public static getInstance(): StudentManager {
        if (!StudentManager.instance) {
            StudentManager.instance = new StudentManager();
        }
        return StudentManager.instance;
    }

    public setFirstName(firstName: string): void {
        this.firstName = firstName;
    }

    public getFirstName(): string | null {
        return this.firstName;
    }

    public setLastName(lastName: string): void {
        this.lastName = lastName;
    }

    public getLastName(): string | null {
        return this.lastName;
    }

    public setProgram(program: string): void {
        this.program = program;
    }

    public getProgram(): string | null {
        return this.program;
    }

    public setNumber(number: number): void {
        this.number = number;
    }

    public getNumber(): number | null {
        return this.number;
    }

    public setYear(year: number): void {
        this.year = year;
    }

    public getYear(): number | null {
        return this.year;
    }

    public setClassRoom(classRoom: string): void {
        this.classRoom = classRoom;
    }

    public getClassRoom(): string | null {
        return this.classRoom;
    }

    public setStudentId(studentId: string): void {
        this.studentId = studentId;
    }

    public getStudentId(): string | null {
        return this.studentId;
    }
}

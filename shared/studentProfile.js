const firstNonEmptyString = (...values) => {
    for (const value of values) {
        if (typeof value === "string" && value.trim() !== "") {
            return value.trim();
        }
    }

    return "";
};

const joinNonEmptyStrings = (values, separator = " ") => {
    return values
        .filter((value) => typeof value === "string" && value.trim() !== "")
        .map((value) => value.trim())
        .join(separator);
};

export const normalizeStudentProfile = (payload = {}) => {
    const name = firstNonEmptyString(
        payload.name,
        joinNonEmptyStrings([payload.firstName, payload.lastName])
    );

    const birthdate = firstNonEmptyString(payload.birthdate, payload.dob);

    const address = firstNonEmptyString(
        payload.address,
        payload.studentAddress,
        payload.homeAddress
    );

    const program = firstNonEmptyString(
        payload.program,
        joinNonEmptyStrings([payload.course, payload.major])
    );

    const studentStatus = firstNonEmptyString(
        payload.studentStatus,
        payload.status,
        payload.studentstatus,
        payload.student_status
    );

    return {
        name,
        birthdate,
        address,
        program,
        studentStatus
    };
};

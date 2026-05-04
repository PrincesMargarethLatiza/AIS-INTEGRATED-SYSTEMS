const legacyBaseUrl =
    process.env.LEGACY_SYSTEM_URL ||
    "https://ais-simulated-legacy.onrender.com/api/students";
const authSystemBaseUrl =
    process.env.AUTH_SYSTEM_URL || "http://localhost:3000/api/users";

const parseResponse = async (response) => {
    const rawBody = await response.text();

    if (!rawBody) {
        return null;
    }

    try {
        return JSON.parse(rawBody);
    } catch {
        return { message: rawBody };
    }
};

const handleLegacyResponse = async (response, fallbackMessage) => {
    const responseBody = await parseResponse(response);

    if (!response.ok) {
        const error = new Error(responseBody?.message || fallbackMessage);
        error.statusCode = response.status;
        error.details = responseBody;
        throw error;
    }

    return responseBody;
};

export const createUser = async (profile) => {
    console.log("Adapter: Sending data to legacy system...");
    console.log("Adapter: Legacy payload", profile);

    const legacyResponse = await fetch(legacyBaseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
    });

    const legacyResult = await handleLegacyResponse(
        legacyResponse,
        "Legacy system registration failed"
    );

    console.log("Adapter: Sending auth profile to auth system...");

    const authResponse = await fetch(`${authSystemBaseUrl}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: profile.name,
            birthdate: profile.birthdate,
            address: profile.address,
            program: profile.program,
            userStatus: profile.studentStatus,
            email: profile.email,
            password: profile.password
        })
    });

    const authResult = await handleLegacyResponse(
        authResponse,
        "Auth system registration failed"
    );

    console.log("Adapter: Legacy API success");

    return {
        success: true,
        student: legacyResult,
        auth: authResult
    };
};

export const getAllUsers = async () => {
    const response = await fetch(legacyBaseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return handleLegacyResponse(
        response,
        "Failed to fetch students from legacy system"
    );
};

export const getUserById = async (userId) => {
    const response = await fetch(`${legacyBaseUrl}/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return handleLegacyResponse(
        response,
        "Failed to fetch student from legacy system"
    );
};

export const login = async (credentials) => {
    console.log("Adapter: Forwarding login request to Auth_System...");

    const response = await fetch(`${authSystemBaseUrl}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
    });

    return handleLegacyResponse(response, "Login failed");
};

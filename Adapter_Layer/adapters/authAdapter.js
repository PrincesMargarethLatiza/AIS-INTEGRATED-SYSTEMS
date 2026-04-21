const legacyBaseUrl =
    process.env.LEGACY_SYSTEM_URL ||
    "https://ais-simulated-legacy.onrender.com/api/students";

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

    const response = await fetch(legacyBaseUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(profile)
    });

    const result = await handleLegacyResponse(
        response,
        "Legacy system registration failed"
    );

    console.log("Adapter: Legacy API success");

    return result;
};

export const getAllUsers = async () => {
    const response = await fetch(legacyBaseUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return handleLegacyResponse(response, "Failed to fetch students from legacy system");
};

export const getUserById = async (userId) => {
    const response = await fetch(`${legacyBaseUrl}/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    return handleLegacyResponse(response, "Failed to fetch student from legacy system");
};

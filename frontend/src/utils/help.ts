import axios from 'axios';

export const formatTime = (timeString: string): string => {
    // Split time into minutes and seconds
    let minutes = 0;
    let seconds = 0;

    if (timeString.includes(":")) {
        // Case: "1:33" -> [minutes, seconds]
        const [min, sec] = timeString.split(":").map(Number);
        minutes = min;
        seconds = sec;
    } else {
        // Case: "52.0" -> Convert into minutes:seconds
        seconds = parseFloat(timeString);
        minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
    }

    // Ensure two-digit formatting
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
}

export const erroHndling = (error: unknown): string => {
    if(!error) {
        return "No Error";
    }

    if (axios.isAxiosError(error) && error.response) {
        const { status } = error.response;
        let parsedError: string;
        switch (status) {
          case 400:
            parsedError = "Bad Request: Please check the data sent.";
            break;
          case 401:
            parsedError = "Unauthorized: Invalid credentials.";
            break;
          case 404:
            parsedError = "Not Found: The requested resource could not be found.";
            break;
          case 500:
            parsedError = error.response.data?.error || error.message;
            break;
          default:
            parsedError = error.response.data?.error || error.message;
        }
        return parsedError;
      } else {
        return error instanceof Error ? error.message : "Unknown Error";
      }
}
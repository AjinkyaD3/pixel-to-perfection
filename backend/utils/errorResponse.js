class ErrorResponse extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.timestamp = new Date().toISOString();

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      success: this.success,
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      timestamp: this.timestamp
    };
  }
}

// Export both as named export and default export for compatibility
module.exports = ErrorResponse;
module.exports.ErrorResponse = ErrorResponse; 
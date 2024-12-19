namespace Service;

public abstract class AppError(string Message) : Exception(Message);

public class NotFoundError(string type, object Properties) : AppError($"{type}({Properties}) was not found!");

public class AuthenticationError() : AppError("Unable to authenticate!");

public class UserNotFoundError() : AppError("User not found");

public class ValidationError(IDictionary<string, string[]> Errors) : AppError("Validation failed!")
{
    public IDictionary<string, string[]> Errors { get; } = Errors;
}


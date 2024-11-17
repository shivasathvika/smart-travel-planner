from fastapi import HTTPException, status

class TravelPlannerException(HTTPException):
    """Base exception for Travel Planner application."""
    def __init__(self, detail: str, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        super().__init__(status_code=status_code, detail=detail)

class ResourceNotFoundException(TravelPlannerException):
    """Exception raised when a requested resource is not found."""
    def __init__(self, resource_type: str, resource_id: str):
        super().__init__(
            detail=f"{resource_type} with id {resource_id} not found",
            status_code=status.HTTP_404_NOT_FOUND
        )

class ValidationException(TravelPlannerException):
    """Exception raised when input validation fails."""
    def __init__(self, detail: str):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_400_BAD_REQUEST
        )

class AuthenticationException(TravelPlannerException):
    """Exception raised when authentication fails."""
    def __init__(self, detail: str = "Authentication failed"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_401_UNAUTHORIZED
        )

class AuthorizationException(TravelPlannerException):
    """Exception raised when user is not authorized to perform an action."""
    def __init__(self, detail: str = "Not authorized to perform this action"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_403_FORBIDDEN
        )

class WeatherServiceException(TravelPlannerException):
    """Exception raised when weather service encounters an error."""
    def __init__(self, detail: str = "Weather service unavailable"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )

class EmailServiceException(TravelPlannerException):
    """Exception raised when email service encounters an error."""
    def __init__(self, detail: str = "Email service unavailable"):
        super().__init__(
            detail=detail,
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )

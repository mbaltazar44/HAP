namespace HAP_API.DTO.ResponseDTO
{
    public class ResponseDTO<T>
    {
        public T Result { get; set; }
        public bool Success { get; set; }
        public string Message { get; set; }

        public ResponseDTO()
        {
            Success = true;
            Message = default;
            Result = Activator.CreateInstance<T>();
        }
        public void AddError(Exception ex)
        {
            Success = false;
            Message = $"error:\"{ex.Message}\", stacktrace:\"{ex.StackTrace}\"";
        }
        public void AddErrorSimple(string ex)
        {
            Success = false;
            Message = ex;
        }
    }
}

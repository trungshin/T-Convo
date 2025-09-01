import { FormFieldProps } from "@/types/auth";
import { Input } from "@/components/ui/input";

const FormField: React.FC<FormFieldProps> = ({
  type,
  placeholder,
  name,
  register,
  error,
  className
}) => (
  <>
    <Input
      type={type}
      placeholder={placeholder}
      className={className}
      {...register(name)}
    />
    {error && <span className="error-message">{error.message}</span>}
  </>
);

export default FormField;

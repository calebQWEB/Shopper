"use client";
import { useForm } from "react-hook-form";

const AuthForm = ({
  onSubmit,
  defaultValues = {},
  renderFields,
  submitLabel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {renderFields({ register, errors })}
      <button className="w-[200px] border border-solid border-headline bg-primary text-headline text-center self-start font-montserrat font-semibold p-3">
        {submitLabel}
      </button>
    </form>
  );
};

export default AuthForm;

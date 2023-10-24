import { useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CryptoJS from "crypto-js"
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [btnLoad, setbtnLoad] = useState(false)
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (initialValues) => {
      setbtnLoad(true)
      localStorage.setItem("email", initialValues?.email);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialValues),
      };
      fetch(`${process.env.REACT_APP_SITE_URL}auth/login`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          setbtnLoad(false);
          if (Object.prototype.hasOwnProperty.call(data, "token")) {
            localStorage.setItem("lm_token", data?.token);
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data?.user), process.env.REACT_APP_SECRET_KEY).toString();
            localStorage.setItem("lm_bundle", ciphertext);
            toast.success('Login Successfully');
            window.location.reload();
            navigate('/', { replace: true });
          } else {
            setbtnLoad(false);
            toast.error(data?.message);
          }
        })
        .catch((error) => {
          toast.error(error?.message);
        });

    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              name="email"
              type="email"
              variant="outlined"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email} />

            <TextField
              name="password"
              label="Password"
              variant="outlined"
              type={showPassword ? 'text' : 'password'}
              {...getFieldProps('password')}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <LoadingButton loading={btnLoad} sx={{ my: 3 }} fullWidth size="large" type="submit" variant="contained">
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}

import {
  Alert,
  Button,
  Divider,
  Grid,
  Paper,
  TextField,
  Zoom,
  Stack,
  Autocomplete,
  Typography,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState, FormEvent, FC, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { State } from "../../state";
import { postEmployee, resetEmployee, updateEmployee } from "../../state/Employee/employee.action.creators";
import { employeeBody, IEmployeeBody } from "../../state/Employee/employee.body";
import { getRole } from "../../state/Role/role.action.creators";
import { IRoleBody } from "../../state/Role/role.body";
import { StatusCode, StatusMessage } from "../../utilities/enum/response.status";
import { IEditForm } from "../../utilities/interfaces/form.control.props";

const FormEmployee: FC<IEditForm> = ({ form, changeFormStatus }) => {
  const dispatch = useDispatch();
  const { postEmployeeResult, updateEmployeeResult } = useSelector(
    (state: State) => state.employee
  );
  const { getRoleResult } = useSelector((state: State) => state.role);
  // Initial Form State
  const [body, setBody] = useState<IEmployeeBody>(employeeBody);
  const [alert, setAlert] = useState({
    open: false,
    color: "success",
    text: "Loading",
  });

  useEffect(() => {
    console.log(postEmployeeResult, "EMP Result")
    if (postEmployeeResult.status === StatusCode.SUCCESS) {
      setAlert({
        open: true,
        color: "success",
        text: postEmployeeResult.message,
      });
      setBody(postEmployeeResult.data as unknown as IEmployeeBody);
    } else if (updateEmployeeResult.status === StatusCode.SUCCESS) {
      setAlert({
        open: true,
        color: "success",
        text: updateEmployeeResult.message,
      });
      setBody(updateEmployeeResult.data as unknown as IEmployeeBody);
    } else if (
      updateEmployeeResult.status === StatusCode.ERROR ||
      postEmployeeResult.status === StatusCode.ERROR
    ) {
      setAlert({ open: true, color: "danger", text: StatusMessage.ERROR });
    }
    setTimeout(() => {
      setAlert({ open: false, color: "success", text: "Reloading" });
    }, 3000);
  }, [postEmployeeResult, updateEmployeeResult, dispatch]);

  const rerender = useCallback(() => {
    dispatch(getRole());
  }, [dispatch]);

  useEffect(() => {
    //   Get Data On Mounts
    rerender();
    return () => {
      dispatch(resetEmployee())
    }
  }, [rerender, dispatch]);
  
  useEffect(() => {
    if (form.edit) {
      setBody(form.data as IEmployeeBody);
    } else {
      setBody(employeeBody);
    }
  }, [form]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let tmpBody = body;
    tmpBody.employee_code = body.role.role_code + "-" + body.employee_code;
    dispatch(postEmployee(tmpBody));
    let submit = {
      e: e,
      tabIndex: 0,
      edit: true,
      data: body,
    };
    changeFormStatus(submit);
  };

  const handleEdit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let tmpBody = body;
    tmpBody.employee_code = body.role.role_code + "-" + body.employee_code;
    dispatch(updateEmployee(tmpBody));
  };

  const handleChange = (
    e: FormEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setBody({
      ...body,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleNew = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    let clear = {
      e: e,
      tabIndex: 0,
      edit: false,
      data: employeeBody,
    };
    changeFormStatus(clear);
  };

  const autoChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    if (value !== null) {
      setBody({
        ...body,
        role: {
          id: value!.id,
          role_name: value!.role_name,
          role_code: value!.role_code,
          department: value!.department,
        },
      });
    } else {
      setBody({
        ...body,
        role: {
          id: null,
          role_name: "",
          role_code: "",
          department: { name: "", dept_id: null },
        },
      });
    }
  };

  return (
    <Paper variant="outlined" sx={{ py: 2 }}>
      <form onSubmit={(e) => (form.edit ? handleEdit(e) : handleSubmit(e))}>
        <Grid px={1} py={1} container spacing={2}>
          <Grid item md={6}>
            <TextField
              fullWidth
              value={body.full_name}
              autoFocus
              label="Employee Name"
              name="full_name"
              placeholder="Full Name"
              size="small"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: 100,
                min: 10,
              }}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              required
              value={body.employee_code}
              label="Employee Code"
              name="employee_code"
              placeholder="Employee Code Not NPWP"
              size="small"
              type="text"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {form.edit ? null : body.role.role_code + "-"}
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              value={body.address}
              label="Address"
              id="address"
              name="address"
              placeholder="District, City"
              size="small"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              fullWidth
              value={body.mobile_no}
              label="Mobile No"
              id="mobile_no"
              name="mobile_no"
              placeholder="Mobile Phone Number"
              size="small"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              fullWidth
              value={body.age}
              label="Age"
              id="age"
              name="age"
              placeholder="Age (This Year)"
              size="small"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              fullWidth
              value={body.npwp}
              label="NPWP"
              id="npwp"
              name="npwp"
              placeholder="NPWP"
              size="small"
              type="text"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
          <Grid item md={6}></Grid>
          <Grid item md={6}>
            <Autocomplete
              options={
                getRoleResult.data ? (getRoleResult.data as IRoleBody[]) : []
              }
              getOptionLabel={(option: IRoleBody) => option.role_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event, value) => autoChange(event, value)}
              loading={getRoleResult.loading}
              value={body.role.id !== null ? body.role : null}
              loadingText="Please Wait"
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.role_name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Role"
                  placeholder="Select Role for this Employee"
                  size="small"
                  type="text"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              )}
            />
            <FormHelperText>
              <Link
                to="/hr/role"
                style={{ textDecoration: "none", color: "#131313" }}
              >
                Can't find role ? Create new Role
              </Link>
            </FormHelperText>
          </Grid>
        </Grid>
        {/* BUTTON WRAPPER */}
        <Grid container justifyContent="center" alignItems="center">
          <Grid item md={12}>
            <Divider>
              <Typography>
                <small>{form.edit ? "Edit" : "Register"} This Employee </small>
              </Typography>
            </Divider>
          </Grid>
          <Grid item md={3}>
            <Stack spacing={2} direction="row">
              <Button
                disabled={alert.open}
                fullWidth
                type="submit"
                color="primary"
                variant="contained"
              >
                Submit
              </Button>
              <Button
                disabled={!form.edit}
                onClick={(e) => handleNew(e)}
                fullWidth
                color="info"
                variant="contained"
              >
                New
              </Button>
            </Stack>
          </Grid>
        </Grid>
        {/* RESPONSE WRAPPER */}
        <Grid container justifyContent="center" alignItems="center">
          <Grid item md={6}>
            <Zoom in={alert.open}>
              <Alert severity={alert.color === "success" ? "success" : "error"}>
                {alert.text}
              </Alert>
            </Zoom>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default FormEmployee;

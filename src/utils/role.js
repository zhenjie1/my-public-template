const phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
const checkPhone = (rule, value, callback) => {
    if (phoneReg.test(value)) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("请输入正确的手机号！"));
    }
}
export const phoneRule = () => ([
    {
        required: true,
        message: "请输入手机号！",
        trigger: 'blur'
    },
    {
        validator: checkPhone,
        trigger: 'blur'
    }])

const codeReg = /[a-zA-Z0-9]{6,20}/

const checkCode = (rule, value, callback) => {
    if (codeReg.test(value)) {
        return Promise.resolve();
    } else {
        return Promise.reject(new Error("请输入由字母或数字组成的编号，20字符以内！"));
    }
}
export const CodeRule = () => ([
    {
        required: true,
        validator: checkCode,
        trigger: 'blur'
    }])


    // const pass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/
    // const resetPass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入密码!'));
    //   } else {
    //     if (this.form.pass !== '') {
    //       if (pass.test(value)){
    //         this.$refs.form.validateField('againPass');
    //         callback();
    //       }else {
    //         callback(new Error('请输入包含大小写字母和数字'))
    //       }
    //     }
    //   }
    // };
    // const resetPassword = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请再次输入密码!'));
    //   } else if (value !== this.form.pass) {
    //     callback(new Error('两次输入密码不一致!'));
    //   } else {
    //     callback();
    //   }
    // }
// alipay.js 这里单独存放一个文件中，需要时引入即可
import AlipaySdk from "alipay-sdk/lib/alipay.js"; // 引入 SDK
const alipaySdk = new AlipaySdk.default({
  appId: "2021000119651006", // 开放平台上创建应用时生成的 appId
  signType: "RSA2", // 签名算法,默认 RSA2
  gateway: "https://openapi.alipaydev.com/gateway.do", // 支付宝网关地址 ，沙箱环境下使用时需要修改
  alipayPublicKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1fvrhrBmDCvaBgUqXD4SYHr+SLvafGv3RzUspoaSiHxKBu89zBgQ6JYMBXFzy1I40K8kVDWSRqFwjyvZ1CGHvh0UTw/B5+NsmENmrT2R9NDw362YPWDhMYHy1wWg1djtGpZKreRn1gXuGunS36gAdwAzZcCHn7ADH/tO9+IHlsm13ukVc0yS+QeIBb1+XTXX8+iwxL0Z+gLeabj1x5e41tQ7YkO0qWnF90kCXjsB5KpAzNJFlT0s4LigasdYVMrtY4xxmjedvl9+mccoeWXOjF4bzUyZMEXjh3x6Vzd3ISHjiu4nkNZTLDIsVnlKyqZuEBYQmY+yXpa2vLEFynMSQIDAQAB", // 支付宝公钥，需要对结果验签时候必填
  privateKey:
    "MIIEpAIBAAKCAQEAvEstr0pB07XmSJO+qAZxjjmAmHxlNIr+byY+4lZudYnxJzzpY5uMRY+X73de5pq+Ofz3VjLvD+Js2T4ibyw46v9LMfjxDBAeflSB0grSsJzWx6PVs7hpHLoi8qlPC4YREl3kmIDOc+eJgSN8cBMGBf+tq604NE14kss4L2umSdTHVfSEHE1g75RNnAPydREY/ZtOMMt4ItQ6yJIWp+fVe5t0N6faynbUFOX4LJiNQaAUsIER6ChsbraIbNCrtSB+GyCYXGBNKpIH/eU6JBVbE0EhaRwQQWtFtdIVnWjOKS0czxKgzSLo6buOpnyO77lJzG50rmzVaEnyQlS2mZ69TwIDAQABAoIBAE1kdRWcZuwW0t035OB5LYlwtxt13b839hZHWQd80Q/8r6MaFS+8ym349FEX9mjAZ7m78Ql8C+iyf1zXfh3FxmtInWaf1KvJoE76exWTH0A6ZslN3NNu071cAGtPDc9FvpSXBRNtte3L2Ce9JzOFji8/BOoQW46b3Rgw8RoEnCex2UeE1tq1r07FsvudFL+zc6LQfiT2TdJqugWMThtpbm+IrhDSlaMgPk/IeiVAZ2ct1bhCMilbWBtlfrXKzHKOaBdKAEDxG9YMoCNkZMOZscnUGNuupD/WkYc8gsy0t7fVWlUX7hoob8dTbvAMmgzaf7nShbUO4WaoP1iRz1BEjTkCgYEA72xeLkRkO0Ufq6qnArcVQN4cwqMWQUAFfj9Kjk2ZN1yWjAGgWatEGANBaVm0AnM302PMfWZvmUnaKMk30+E6p2WoCNaUAM/J13iisSIcxgSIt3JzMKwLCARhh4L2NFKZJjuOVvWMDqJfxmO5zyVd66lzl2vU9veOC43bRMi0YAsCgYEAyVSRm8QedmUix6js8SQn2jr1atGRuGUbY4gqFYXUJ61rvY3KFl67M/eAEIXU9aGfrm3iKkdzQ1srI43gWKfqkLyAtalPTHx1ZFMmzVHuMOmZpOD3soWom5wwaiFBwfKpHeN8zqU5ac4jKp55tABokoIb83SFFddxfz2LTZZfzk0CgYBgUlq5hm5EohSRvcAfCYUVacZsT6xeZ+FN3yyhf3qKmUc/4E+gg5SLjJO+TIZtDemBs/7K3HE9XEbWbc12AoDUY8NsetdkVDRB6ZiaZrzotV5DX1oUVMLDYO/T0s42UpymkwM63OKR6KVbbTeNrNzSOIP2gT1WdlXBNDrou05F7QKBgQCbPnnU+cJfmxbZjHnAbBfK4GGzj4vk+xnGgw2ocPyp58DHdpkY7M0/gh6fHwOasJk34IVgAp5vltJJ5THUSw7FsoUxDzAVk3bV+IRYGFAqKUcPa2W0o/nim+p9O82/5wTfBjaMBb2ix5A4YeEImrQIHQm+jd+9etaKvgM3vbd8lQKBgQDMNmkVVgfTDkxQJZ5egfxmGY8Rs7rGEr1NTvi88ckRA6XWhBDW+IOhuNPsspRtwQjwy7eZIV4XoBIRhVPrOMPknKu42SxCmIBJirnl8eBAiwMSVvIPrH5QsGMexftOnD7vdPiS895lP7lJag8qKVp7dieWvvlIol3VOS/94+ekyg==", // 应用私钥字符串
});
export default alipaySdk;

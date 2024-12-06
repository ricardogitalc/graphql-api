export const CONFIG_MESSAGES = {
  tokenRefreshed: 'Acesso renovado com sucesso.',
  tokenInvalid: 'Token inválido ou expirado.',
  tokenNotSent: 'Token não fornecido.',
  invalidCredentials: 'Credenciais inválidas.',
  invalidPassword: 'Senha incorreta.',

  // USER SUCCESS
  userCreated: 'Usuário criado.',
  userUpdated: 'Usuário atualizado.',
  userDeleted: 'Usuário deletado.',
  userVerified: 'Usuário verificado.',
  userLogged: 'Login realizado.',
  userLoggedOut: 'Logout realizado.',

  // USER ERROR
  userExists: 'Usuário já cadastrado.',
  userAllReady: 'Usuário já existe.',
  userNotFound: 'Usuário não encontrado.',
  userIdNotFound: 'Nenhum usuário com este ID.',
  userNotVerified: 'Usuário não verificado.',
  userNoPermission: 'Usuário sem permissão.',

  // AUTH SUCCESS
  loginLinkSent: 'Link de acesso enviado.',
  verificationLinkSent: 'Link de verificação enviado.',
  tokenUpdated: 'Token atualizado.',

  // AUTH ERROR
  expiredToken: 'Token inválido ou expirado.',
  invalidToken: 'Token inválido.',
  invalidRefreshToken: 'Refresh token inválido.',
  accessLinkExpired: 'Link expirado.',
  unauthorized: 'Não autorizado.',

  // VALIDATION ERROR
  invalidData: 'Dados inválidos.',
  invalidEmail: 'Email inválido.',
  tooManyRequests: 'Muitas tentativas, aguarde um momento.',

  // INTEGRATION ERROR
  googleLoginError: 'Erro no login Google.',

  // RESET PASSWORD
  resetPasswordReseted: 'Senha redefinida com sucesso.',
  resetPasswordLinkSent: 'Link de redefinição enviado.',
} as const;

export const JWT_TIMES = {
  ACCESS_TOKEN: '30m',
  REFRESH_TOKEN: '1d',
} as const;

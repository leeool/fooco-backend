const deleteUserLimit = {
  timeInMinutes: 60 * 24,
  maxRequests: 5,
  message: "Muitas contas deletas neste IP. Você foi bloqueado temporariamente:"
}

const updateUserLimit = {
  timeInMinutes: 60,
  maxRequests: 10,
  message:
    "Por favor, aguarde alguns minutos para atualizar sua conta novamente:"
}

const postUserLimit = {
  timeInMinutes: 30,
  maxRequests: 5,
  message: "Muitas contas criadas neste IP. Você foi bloqueado temporariamente:"
}

const defaultLimiter = {
  timeInMinutes: 10,
  maxRequests: 30,
  message: "Muitas requisições neste IP. Você foi bloqueado temporariamente:"
}

const loginUserLimit = {
  timeInMinutes: 10,
  maxRequests: 10,
  message:
    "Muitas tentativias de login neste IP. Você foi bloqueado temporariamente:"
}

export {
  deleteUserLimit,
  updateUserLimit,
  postUserLimit,
  defaultLimiter,
  loginUserLimit
}

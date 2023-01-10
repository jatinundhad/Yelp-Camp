function AsyncCatch(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch(next);
  };
}

export default AsyncCatch;

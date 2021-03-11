const asyncHandler = fn =>
// console.log('fn : ',fn);
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
    // console.log('next error : ', next)
      .catch(next);
  };

// export default asyncHandler;
module.exports= asyncHandler
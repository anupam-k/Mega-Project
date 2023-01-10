const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.code || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export default asyncHandler;

// const asyncHandler = () => {};
// const asyncHandler = (func) => {};
// const asyncHandler = (func) => () => {};
// const asyncHandler = (func) => async () => {};

// Another way of writing AsyncHandler
// function asyncHandler(fn){
//     return async function (req, res, next) {
//     try {
//     await fn(req, res, next);
//     } catch (err) {
//     res.status(err.code || 500).json({
//         success: false,
//     });
//    }
//   }
// };

# Interpolating Polynomials - A WebAssembly LAPACK Demo

A demo that finds interpolating polynomials for a set of points, demonstrating LAPACK routines running in a web browser using WebAssembly.

Click the plot to add new points. An interpolating polynomial will be found to pass through all the points using LAPACK to implement [Vandermonde's method](https://en.wikipedia.org/wiki/Vandermonde_matrix). Notice how while in principle it is always possible to find an $n$ degree polynomial to fit $n$ data points, often the result is poor and can generate large spikes between each data point.

https://georgestagg.github.io/interpolating-polynomials-wasm/

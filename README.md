# Interpolating Polynomials - A WebAssembly LAPACK Demo

A demo that finds interpolating polynomials for a set of points, demonstrating LAPACK routines running in a web browser using WebAssembly.

Click the plot to add new points. An interpolating polynomial will be found to pass through all the points using LAPACK to implement [Vandermonde's method](https://en.wikipedia.org/wiki/Vandermonde_matrix). It is always possible to find a unique $n-1$ degree polynomial containing $n$ data points exactly. However, when $n$ is large the polynomial fluctuates wildly between successive data points. This is known as [Runge's phenomenon](https://en.wikipedia.org/wiki/Runge%27s_phenomenon).].

https://georgestagg.github.io/interpolating-polynomials-wasm/

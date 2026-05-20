import numpy as np

def dist(A, B):
  return np.sqrt(np.sum((A - B) ** 2 ))

def class_of_each_point(X, centers):
  m = len(X)
  k = len(centers)

  distances = np.zeros((m, k))
  for i in range(m):
    for j in range(k):
      distances[i, j] = dist(centers[j], X[i])

  return np.argmin(distances, axis=1)


def kmeans(k, X):
  m, n = X.shape
  curr_iteration = prev_iteration = np.zeros(m)

  x_min = np.min(X, axis=0)
  x_max = np.max(X, axis=0)
  centers = np.random.random((k, n)) * (x_max - x_min) + x_min
 
  curr_iteration = class_of_each_point(X, centers)

  while np.any(curr_iteration != prev_iteration):
    prev_iteration = curr_iteration

    for i in range(k):
      sub_X = X[curr_iteration == i,:]
      if len(sub_X) > 0:
        centers[i,:] = np.mean(sub_X, axis=0)

    curr_iteration = class_of_each_point(X, centers)
  
  return centers

// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace UserOwnsData.Services.Security
{
	using Microsoft.Identity.Client;
	using System;
	using System.Runtime.Caching;

	// Refer https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect to user token caching
	public class MSALPerUserMemoryTokenCache
	{
		/// <summary>
		/// The backing MemoryCache instance
		/// </summary>
		internal readonly MemoryCache memoryCache = MemoryCache.Default;

		/// <summary>
		/// The duration till the tokens are kept in memory cache. In production, a higher value, upto 90 days is recommended.
		/// </summary>
		private readonly DateTimeOffset cacheDuration = DateTimeOffset.Now.AddHours(48);

		/// <summary>
		/// Initializes a new instance of the <see cref="MSALPerUserMemoryTokenCache"/> class.
		/// </summary>
		/// <param name="tokenCache">The client's instance of the token cache.</param>
		public MSALPerUserMemoryTokenCache(ITokenCache tokenCache)
		{
			Initialize(tokenCache);
		}

		/// <summary>Initializes the cache instance</summary>
		/// <param name="tokenCache">The ITokenCache passed through the constructor</param>
		/// <param name="user">The signed-in user for whom the cache needs to be established..</param>
		private void Initialize(ITokenCache tokenCache)
		{
			tokenCache.SetBeforeAccess(UserTokenCacheBeforeAccessNotification);
			tokenCache.SetAfterAccess(UserTokenCacheAfterAccessNotification);
			tokenCache.SetBeforeWrite(UserTokenCacheBeforeWriteNotification);
		}

		/// <summary>
		/// Triggered right after MSAL accessed the cache.
		/// </summary>
		/// <param name="args">Contains parameters used by the MSAL call accessing the cache.</param>
		private void UserTokenCacheAfterAccessNotification(TokenCacheNotificationArgs args)
		{
			// if the access operation resulted in a cache update
			if (args.HasStateChanged)
			{
				string cacheKey = args.SuggestedCacheKey;
				if (args.HasTokens)
				{
					if (string.IsNullOrWhiteSpace(cacheKey))
						return;

					// Ideally, methods that load and persist should be thread safe.MemoryCache.Get() is thread safe.
					memoryCache.Set(cacheKey, args.TokenCache.SerializeMsalV3(), cacheDuration);
				}
				else
				{
					memoryCache.Remove(cacheKey);
				}
			}
		}

		/// <summary>
		/// Triggered right before MSAL needs to access the cache. Reload the cache from the persistence store in case it changed since the last access.
		/// </summary>
		/// <param name="args">Contains parameters used by the MSAL call accessing the cache.</param>
		private void UserTokenCacheBeforeAccessNotification(TokenCacheNotificationArgs args)
		{
			string cacheKey = args.SuggestedCacheKey;
			if (string.IsNullOrEmpty(cacheKey))
			{
				return;
			}

			byte[] tokenCacheBytes = (byte[])memoryCache.Get(cacheKey);
			args.TokenCache.DeserializeMsalV3(tokenCacheBytes, shouldClearExistingCache: true);
		}

		/// <summary>
		/// if you want to ensure that no concurrent write take place, use this notification to place a lock on the entry
		/// </summary>
		/// <param name="args">Contains parameters used by the MSAL call accessing the cache.</param>
		private void UserTokenCacheBeforeWriteNotification(TokenCacheNotificationArgs args)
		{
			// Since we are using a MemoryCache ,whose methods are threads safe, we need not to do anything in this handler.
		}
	}
}
